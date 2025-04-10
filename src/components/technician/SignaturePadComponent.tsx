import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Signature, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveSignature } from '@/services/photoService';
import SignaturePad from 'react-signature-pad-wrapper';

interface SignaturePadComponentProps {
  workOrderId: string;
  refetch: () => void;
}

const SignaturePadComponent: React.FC<SignaturePadComponentProps> = ({ workOrderId, refetch }) => {
  const { toast } = useToast();
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const saveSignatureMutation = useMutation({
    mutationFn: (signatureFile: File) => saveSignature(workOrderId, signatureFile),
    onSuccess: () => {
      toast({
        title: "Assinatura salva",
        description: "A assinatura foi salva com sucesso."
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar assinatura",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSaveSignature = () => {
    if (signaturePad) {
      setIsSavingSignature(true);
      const dataUrl = signaturePad.toDataURL();
      if (dataUrl) {
        // Convert Data URL to a Blob
        const blob = dataURLtoBlob(dataUrl);
        const signatureFile = new File([blob], `signature_${workOrderId}.png`, { type: 'image/png' });
        
        saveSignatureMutation.mutate(signatureFile);
      } else {
        toast({
          title: "Erro ao salvar assinatura",
          description: "Nenhuma assinatura detectada.",
          variant: "destructive"
        });
      }
      setIsSavingSignature(false);
    }
  };
  
  const dataURLtoBlob = (dataUrl: string) => {
    const parts = dataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assinatura do Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md" style={{ width: '100%', height: '200px' }}>
          <SignaturePad 
            options={{ 
              minWidth: 1, 
              maxWidth: 3, 
              penColor: "rgb(66, 153, 225)"
            }}
            ref={(ref) => setSignaturePad(ref)}
          />
        </div>
        <Button 
          onClick={handleSaveSignature} 
          disabled={saveSignatureMutation.isPending || isSavingSignature}
          className="mt-4"
        >
          {saveSignatureMutation.isPending || isSavingSignature ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Salvando Assinatura...
            </>
          ) : (
            <>
              <Signature className="mr-2 h-4 w-4" />
              Salvar Assinatura
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignaturePadComponent;
