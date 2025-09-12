import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  creatorId: string;
  chatId: string;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  creatorId,
  chatId,
  onPaymentSuccess
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create payment intent for the media purchase
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          description,
          creatorId,
          chatId,
          metadata: {
            type: 'media_purchase',
            chat_id: chatId,
            creator_id: creatorId
          }
        }),
      });

      const { clientSecret, paymentIntentId } = await response.json();

      // For demo purposes, simulate successful payment
      // In production, you'd integrate with Stripe Elements
      setTimeout(() => {
        toast({
          title: "Payment Successful!",
          description: `$${amount} charged successfully. Creator will receive payout.`,
        });
        
        onPaymentSuccess();
        onClose();
        setIsProcessing(false);
      }, 2000);

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount:</span>
              <span className="text-xl font-bold">${amount}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Creator receives 85% after platform fee
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="card">Card Information</Label>
              <Input
                id="card"
                placeholder="4242 4242 4242 4242"
                className="mt-1"
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiry">Expiry</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  className="mt-1"
                  disabled={isProcessing}
                />
              </div>
              <div>
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  className="mt-1"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${amount}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}