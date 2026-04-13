import { orderApi } from '@/apis/order/order.api';
import type { MenuListItemResponse } from '@/types/menu/menu.dto';
import { type OrderItemResponse, type OwnerOrderListItemResponse } from '@/types/order/order.dto';
import { getErrorMsg } from '@/utils/error';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  scheduleId: number;
  menus: MenuListItemResponse[];
  initialOrder?: OwnerOrderListItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}



function OrderFormModal({open, scheduleId, menus, initialOrder, onClose, onSuccess}: Props) {
  const [items, setItems] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialOrder;

  useEffect(() => {
    if(!initialOrder) {
      setItems([]);
      return;
    }

    setItems(
      initialOrder.menus.map(menu => ({
        menuItemId: menu.menuItemId,
        menuItemName: menu.menuItemName,
        unitPrice: menu.unitPrice,
        qty: menu.qty
      }))
    );
  }, [initialOrder])

  if(!open) return null;

  const addItem = (menu: MenuListItemResponse) => {
    setItems(prev => {
      const exist = prev.find(i => i.menuItemId === menu.id);

      if(exist) {
        return prev.map(i => 
          i.menuItemId === menu.id
          ? {...i, qty: i.qty + 1}
          : i
        );
      }

      return [
        ...prev,
        {
          menuItemId: menu.id,
          menuItemName: menu.name,
          unitPrice: menu.price,
          qty: 1
        },
      ];
    });
  };

  const removeItem = (menuId: number) => {
    setItems(prev => 
      prev.map(i => 
        i.menuItemId === menuId
        ? {...i, qty: i.qty - 1}
        : i
      ).filter(i => i.qty > 0)
    );
  };

  const totalPrice = items.reduce(
    (sum, i) => sum + i.unitPrice * i.qty,
    0
  );

  const handleSubmit = async () => {
    if(items.length === 0) {
      alert("메뉴를 선택하세요.");
      return;
    }

    try {
      setLoading(true);

      if(isEdit) {
        await orderApi.updateOrder(initialOrder.id, {
          items :items.map(item => ({
            menuItemId: item.menuItemId,
            qty: item.qty
          }))
        });

        onSuccess();
        onClose();
        toast.success("주문이 수정되었습니다.");
      } else {
        await orderApi.createOrder({
          scheduleId,
          source: "ONSITE",
          menus: items.map(item => ({
            menuItemId: item.menuItemId,
            qty: item.qty
          }))
        });
  
        onSuccess();
        onClose();
        toast.success("주문이 등록되었습니다.")
      }
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>{isEdit ? "주문 수정" : "현장 주문 등록"}</Header>

        <MenuList>
          {menus.map(menu => {
            const selected = items.find(i => i.menuItemId === menu.id);

            return (
              <MenuItem key={menu.id} >
                
                <MenuInfo>
                  <MenuRow>
                    <MenuName isSoldOut={menu.isSoldOut}>
                      {menu.name}
                      {menu.isSoldOut && <SoldOutBadge>품절</SoldOutBadge>}
                    </MenuName>
                    <Price>{menu.price.toLocaleString()}KRW</Price>
                  </MenuRow>
                </MenuInfo>

                <QuantityWrapper>
                  <QtyButton 
                    onClick={() => removeItem(menu.id)}
                    disabled={menu.isSoldOut}
                  >
                    -
                  </QtyButton>
                  <Qty>{selected?.qty ?? 0}</Qty>
                  <QtyButton 
                    onClick={() => addItem(menu)}
                    disabled={menu.isSoldOut}
                  >
                    +
                  </QtyButton>
                </QuantityWrapper>
              </MenuItem>
            )
          })}
        </MenuList>

        {items.length > 0 && (
          <SelectedList>
            {items.map(item => (
              <SelectedItem key={item.menuItemId}>
                <SelectedMenu>
                  {item.menuItemName} X {item.qty}
                </SelectedMenu>
                <SelectedPrice>
                  {(item.unitPrice * item.qty).toLocaleString()}KRW
                </SelectedPrice>
              </SelectedItem>
            ))}
          </SelectedList>
        )}

        <Summary>
          총 금액: {totalPrice.toLocaleString()}KRW
        </Summary>

        <ButtonRow>
          <CancelButton onClick={onClose}>취소</CancelButton>

          <CreateButton
            disabled={loading || items.length === 0}
            onClick={handleSubmit}
          >
            {isEdit ? "주문 수정" : "주문 등록"}
          </CreateButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  )
}

export default OrderFormModal

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Modal = styled.div`
  width: 100%;
  max-width: 560px;
  height: 80vh;
  background: #fff;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
`;

const Header = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const MenuList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fafafa;
  border: 1px solid #eee;
`;

const MenuRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuName = styled.div<{isSoldOut: boolean}>`
  font-size: 15px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;

  color: ${({ isSoldOut }) => (isSoldOut ? "rgba(0,0,0,0.5)" : "#000")};
`;

const SoldOutBadge = styled.div`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ffe5e5;
  color: #ff4d4f;
  white-space: nowrap;
`;

const Price = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  font-weight: 600;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #e5e7eb;
  }

  &:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Qty = styled.span`
  width: 24px;
  text-align: center;
  font-weight: 500;
`;

const SelectedList = styled.div`
  border-top: 1px solid #ddd;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SelectedItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const SelectedMenu = styled.span`
  font-weight: 500;
`;

const SelectedPrice = styled.span`
  color: #374151;
  font-weight: 500;
`;

const Summary = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: #fff7eb;
  border: 1px solid #fed7aa;
  font-weight: 600;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const CancelButton = styled.button`
  padding: 7px 14px;
  border: none;
  background: #e5e7db;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #d1d5db;
  }
`;

const CreateButton = styled.button`
  padding: 7px 14px;
  border: none;
  background: #ff6b00;
  color: white;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #e55d00;
  }

  &:disabled {
    background:  #9ca3af;
    cursor: not-allowed;
  }
`;