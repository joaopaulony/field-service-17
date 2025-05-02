
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface QuoteEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: (recipientEmail: string, subject?: string, message?: string) => Promise<void>;
  defaultEmail?: string;
  quoteId: string;
}

const QuoteEmailDialog: React.FC<QuoteEmailDialogProps> = ({
  isOpen,
  onClose,
  onSendEmail,
  defaultEmail = "",
  quoteId,
}) => {
  const [recipientEmail, setRecipientEmail] = useState(defaultEmail);
  const [subject, setSubject] = useState(`Orçamento #${quoteId.substring(0, 8)}`);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!recipientEmail) return;

    setIsSending(true);
    try {
      await onSendEmail(recipientEmail, subject, message);
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enviar Orçamento por Email</DialogTitle>
          <DialogDescription>
            Envie este orçamento como PDF para o cliente via email.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="email@cliente.com"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Assunto
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Mensagem
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mensagem opcional para o cliente"
              className="col-span-3"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={!recipientEmail || isSending}>
            {isSending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteEmailDialog;
