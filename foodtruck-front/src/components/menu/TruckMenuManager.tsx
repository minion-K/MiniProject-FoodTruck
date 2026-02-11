import { menuApi } from "@/apis/menu/menu.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useState } from "react";
import MenuModal from "./MenuModal";
import type { MenuListItemResponse, MenuListResponse } from "@/types/menu/menu.dto";
import toast from "react-hot-toast";

interface Props {
  truckId: number;
  menuList: MenuListResponse;
  onUpdate: () => void;
}

function TruckMenuManager({ truckId, menuList, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<MenuListItemResponse | null>(null);

  const handleAdd = () => {
    setEditMenu(null);
    setOpen(true);
  };

  const handleEdit = (menu: MenuListItemResponse) => {
    setEditMenu(menu);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);

    if(editMenu) {
      toast.success("메뉴가 수정되었습니다.");
    } else {
      toast.success("메뉴가 추가되었습니다.");
    }

    onUpdate();
  }

  const handleDelete = async (menuId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await menuApi.deleteMenu(menuId);

      toast.success("메뉴가 삭제되었습니다.", {icon: "🗑️"});
      onUpdate();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  return (
    <Container>
      <Header>
        <AddButton onClick={handleAdd}>+ 메뉴 추가</AddButton>
      </Header>

      {menuList.length === 0 ? (
        <EmptyText>등록된 메뉴가 없습니다.</EmptyText>
      ) : (
        <List>
          {menuList.map((menu) => (
            <Item key={menu.id}>
              <Info>
                <MenuName isSoldOut={menu.isSoldOut}>{menu.name}</MenuName>
                <MenuPrice>{menu.price.toLocaleString()} KRW</MenuPrice>
              </Info>

              <Actions>
                <ActionButton onClick={() => handleEdit(menu)}>
                  수정
                </ActionButton>
                <ActionButton onClick={() => handleDelete(menu.id)}>
                  삭제
                </ActionButton>
              </Actions>
            </Item>
          ))}
        </List>
      )}

      {open && (
        <MenuModal
          truckId={truckId}
          menu={editMenu}
          onClose={() => setOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </Container>
  );
}

export default TruckMenuManager;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AddButton = styled.button`
  padding: 6px 12px;
  background-color: #ff6b00;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
  padding: 10px 12px;
  border-radius: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuName = styled.div<{ isSoldOut?: boolean }>`
  flex: 1;
  color: ${({ isSoldOut }) => (isSoldOut ? "#999" : "#000")};
`;

const MenuPrice = styled.div`
  font-size: 13px;
  color: #666;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionButton = styled.div`
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: #f2f2f2;

  &:hover {
    background-color: #ddd;
  }
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #888;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
  text-align: center;
`;
