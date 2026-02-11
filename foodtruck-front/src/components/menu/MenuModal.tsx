import { menuApi } from "@/apis/menu/menu.api";
import type { MenuListItemResponse } from "@/types/menu/menu.dto";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useState } from "react";

interface Props {
  truckId: number;
  menu: MenuListItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

function MenuModal({ truckId, menu, onClose, onSuccess }: Props) {
  const [name, setName] = useState(menu?.name ?? "");
  const [price, setPrice] = useState(menu ? String(menu.price) : "");
  const [optionText, setOptionText] = useState(menu?.optionText ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if(!name.trim()) {
      alert("메뉴명을 입력해주세요");

      return;
    }

    const numericPrice = Number(price);

    if(!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("가격은 0보다 커야 합니다.");

      return;
    }
    try {
      setLoading(true);

      if(menu) {
        await menuApi.updateMenu(menu.id, {
          name,
          price: numericPrice,
          optionText: optionText || undefined
        });
      } else {
        await menuApi.createMenu({
          truckId,
          name,
          price: numericPrice,
          optionText: optionText || undefined
        })
      }

      onSuccess();
    } catch (e) {
      alert(getErrorMsg(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Title>{menu ? "메뉴 수정" : "메뉴 추가"}</Title>

        <Field>
          <Label>메뉴명</Label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field>
          <Label>가격</Label>
          <Input 
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              if(!/^\d*$/.test(value)) return;
              setPrice(value);
            }}
          />
        </Field>

        <Field>
          <Label>옵션</Label>
          <Input 
            value={optionText}
            onChange={(e) => setOptionText(e.target.value)}
          />
        </Field>

        <ButtonRow>
          <Button onClick={onClose} disabled={loading}>
            취소
          </Button>
          <PrimaryButton onClick={handleSubmit} disabled={loading}>
            {menu ? "수정" : "추가"}
          </PrimaryButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  )
}

export default MenuModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 13px;
  color: #333;

  &:focus {
    outline: none;
    border-color: #ff6b00;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: #eee;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: #ff6b00;
  color: white;
`;