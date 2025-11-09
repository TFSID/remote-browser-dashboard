"use client";

import React, { useState, ChangeEvent } from 'react';
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

export const CaptchaModal: React.FC<CaptchaModalProps> = ({ show, captchaImage, sendMessage, onClose }) => {
  const [captchaSolution, setCaptchaSolution] = useState<string>('');

  const handleSubmitCaptcha = () => {
    if (!captchaSolution) return;
    sendMessage({ action: 'solve_solution', solution: captchaSolution });
    setCaptchaSolution('');
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Solve CAPTCHA</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            <img
              src={`data:image/png;base64,${captchaImage}`}
              alt="CAPTCHA"
              className="max-w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="solution" className="text-right">
              Solution
            </Label>
            <Input
              id="solution"
              value={captchaSolution}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCaptchaSolution(e.target.value)}
              placeholder="Enter CAPTCHA solution"
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmitCaptcha} disabled={!captchaSolution}>
            Submit Solution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};