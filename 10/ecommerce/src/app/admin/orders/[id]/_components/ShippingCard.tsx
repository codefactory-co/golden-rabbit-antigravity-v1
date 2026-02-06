
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/core/domain/entities/order/Order";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { updateTrackingNumberAction } from "../actions";
import { MapPin, Phone, User } from "lucide-react";

interface ShippingCardProps {
    order: Order;
}

export function ShippingCard({ order }: ShippingCardProps) {
    const [carrier, setCarrier] = useState(order.tracking?.carrier || "");
    const [trackingNumber, setTrackingNumber] = useState(order.tracking?.trackingNumber || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!carrier || !trackingNumber) {
            alert("택배사와 운송장번호를 모두 입력해주세요.");
            return;
        }
        setIsSaving(true);
        try {
            await updateTrackingNumberAction(order.id, carrier, trackingNumber);
            alert("운송장 정보가 등록되었습니다.");
        } catch (error) {
            console.error(error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">배송 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Receiver Info */}
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <User className="w-4 h-4 text-gray-500 mt-1" />
                        <div className="text-sm">
                            <p className="font-medium">{order.receiver?.name || "수령인 정보 없음"}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-gray-500 mt-1" />
                        <div className="text-sm">
                            <p>{order.receiver?.phone || "-"}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div className="text-sm">
                            <p>{order.receiver?.address || "-"}</p>
                        </div>
                    </div>
                    {order.receiver?.message && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            배송메모: {order.receiver.message}
                        </div>
                    )}
                </div>

                {/* Tracking Input */}
                <div className="pt-4 border-t">
                    <label className="text-sm font-medium mb-2 block">운송장 정보 입력</label>
                    <div className="flex gap-2">
                        <Select value={carrier} onValueChange={setCarrier}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="택배사" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CJ Logistics">CJ대한통운</SelectItem>
                                <SelectItem value="Post Office">우체국택배</SelectItem>
                                <SelectItem value="Lotte">롯데택배</SelectItem>
                                <SelectItem value="Logen">로젠택배</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="운송장번호"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleSave} disabled={isSaving} variant="outline">
                            {isSaving ? "저장중" : "등록"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
