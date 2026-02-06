import { truckApi } from "@/apis/truck/truck.api";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

function TruckCreateModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const navigate = useNavigate();

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      const truck = await truckApi.createTruck({
        name,
        cuisine,
      });

      onClose();
      navigate(`/owner/trucks/${truck.id}`);
    } catch (e) {
      alert(getErrorMsg(e));
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>트럭 추가</Title>
          <SubTitle>새로운 푸드트럭 정보를 입력해주세요</SubTitle>
        </Header>

        <Body>
          <Field>
            <Label>트럭 이름</Label>
            <Input
              placeholder="예) 부산타코"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field>
              <Label>음식 종류</Label>
              <Input
                placeholder="예) 한식, 양식, 일식"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </Field>
          </Field>
        </Body>

        <Footer>
          <GhostButton onClick={onClose}>취소</GhostButton>
          <PrimaryButton onClick={handleSubmit}>추가</PrimaryButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}

export default TruckCreateModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  width: 360px;
  background: white;
  padding: 24px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #222;
`;

const SubTitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #777;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #444;
`;

const Input = styled.input`
  padding: 11px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;

  &:hover {
    border-color: #ff6b00;
    box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.15);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const GhostButton = styled.button`
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  background: #f1f1f1;
  color: #444;
  cursor: pointer;

  &:hover {
    background: #e5e5e5;
  }
`;

const PrimaryButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  background: #ff6b00;
  color: white;
  cursor: pointer;

  &:hover {
    background: #e85d00;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
