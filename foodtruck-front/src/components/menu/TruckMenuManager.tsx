import { menuApi } from "@/apis/menu/menu.api";
import { truckApi } from "@/apis/truck/truck.api";
import type {
  TruckMenuItemResponse,
  TruckMenuListResponse,
} from "@/types/truck/truck.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useState } from "react";
import MenuModal from "./MenuModal";

interface Props {
  truckId: number;
  menuList: TruckMenuListResponse;
  onUpdate: () => void;
}

function TruckMenuManager({ truckId, menuList, onUpdate }: Props) {
  const [menus, setMenus] = useState(menuList);
  const [open, setOpen] = useState(false);
  const [editMenu, setEditMenu] = useState<TruckMenuItemResponse | null>(null);

  const handleAdd = () => {
    setEditMenu(null);
    setOpen(true);
  };

  const handleEdit = (menu: TruckMenuItemResponse) => {
    setEditMenu(menu);
    setOpen(true);
  };

  const handleDelete = async (menuId: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await menuApi.deleteMenu(menuId);
      onUpdate();
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  return (
    <Container>
      <ButtonRow>
        <ActionButton onClick={handleAdd}>+ 메뉴 추가</ActionButton>
      </ButtonRow>

      {menus.length === 0 ? (
        <EmptyText>등록된 메뉴가 없습니다.</EmptyText>
      ) : (
        <MenuList>
          {menus.map((menu) => (
            <MenuItem key={menu.id}>
              <MenuName isSoldOut={menu.isSoldOut}>{menu.name}</MenuName>
              <MenuPrice>{menu.price.toLocaleString()} KRW</MenuPrice>
              <Actions>
                <ActionButton onClick={() => handleEdit(menu)}>
                  수정
                </ActionButton>
                <ActionButton onClick={() => handleDelete(menu.id)}>
                  삭제
                </ActionButton>
              </Actions>
            </MenuItem>
          ))}
        </MenuList>
      )}

      {open && (
        <MenuModal
          truckId={truckId}
          menu={editMenu}
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            onUpdate;
          }}
        />
      )}
    </Container>
  );
}

export default TruckMenuManager;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AddButton = styled.button`
  padding: 6px 10px;
  background-color: #ff6b00;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafafa;
  padding: 8px 10px;
  border-radius: 8px;
`;

const MenuName = styled.div<{ isSoldOut?: boolean }>`
  flex: 1;
  color: ${({ isSoldOut }) => (isSoldOut ? "#999" : "#000")};
`;

const MenuPrice = styled.div`
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 4px;
`;

const ActionButton = styled.div`
  padding: 4px 6px;
  font-size: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: #eee;

  &:hover {
    background-color: #ddd;
  }
`;

const EmptyText = styled.div`
  font-size: 14px;
  color: #888;
`;
