import { menuApi } from "@/apis/menu/menu.api";
import type { TruckMenuItemResponse } from "@/types/truck/truck.dto";
import React, { useState } from "react";

interface Props {
  truckId: number;
  menu: TruckMenuItemResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

function MenuModal({ truckId, menu, onClose, onSuccess }: Props) {
  const [name, setName] = useState(menu?.name ?? "");
  const [price, setPrice] = useState(menu?.price ?? 0);
  const [isSoldOut, setIsSoldOut] = useState(menu?.isSoldOut ?? false);

  const handleSubmit = async () => {
    try {
      
    }
  }
}

export default MenuModal;
