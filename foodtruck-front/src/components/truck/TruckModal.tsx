import type { TruckFormData } from "@/types/truck/truck.type";
import { getErrorMsg } from "@/utils/error";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValue?: TruckFormData;
  onSubmit: (data: TruckFormData) => Promise<void>;
}

function TruckModal({ open, onClose, initialValue, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;
  const isEdit = !!initialValue;

  useEffect(() => {
    if(initialValue) {
      setName(initialValue.name ?? "");
      setCuisine(initialValue.cuisine ?? "");
    } else {
      setName("");
      setCuisine("");
    }
  }, [initialValue, open]);

  const handleSubmit = async () => {
    if(!name.trim()) return alert("트럭명을 입력해주세요");
    if(name.length > 100) return alert("트럭명은 100자 이내로 입력해주세요");
    if(cuisine.length > 50) return alert("음식 장르는 50자 이내로 입력해주세요");

    setLoading(true);
    try {
      await onSubmit({name, cuisine});

      onClose();
    } catch (e) {
      alert(getErrorMsg(e) || "처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>{isEdit ? "트럭 정보 수정" : "트럭 추가"}</Title>
          <SubTitle>{isEdit ? "수정할 트럭 정보를 입력해주세요" : "새로운 푸드트럭 정보를 입력해주세요"}</SubTitle>
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
          <PrimaryButton 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "처리 중..." : isEdit ? "저장" : "추가"}
          </PrimaryButton>
        </Footer>
      </Modal>
    </Overlay>
  );
}

export default TruckModal;

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
