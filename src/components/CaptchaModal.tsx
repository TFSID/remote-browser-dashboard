"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CaptchaModalProps {
  show: boolean;
  captchaImage: string;
  sendMessage: (message: any) => void;
  onClose: () => void;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({ show, onClose }) => {
  // Modal tidak akan pernah ditampilkan karena show selalu false di index.tsx
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CAPTCHA (Disabled)</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-center text-gray-500">CAPTCHA solving functionality is disabled.</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};