
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { uploadCompanyLogo } from "@/services/companyService";
import { Camera, UploadCloud, X, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LogoUploadProps {
  currentLogo: string | null;
  onLogoUpdate: (url: string) => void;
  companyName: string;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ currentLogo, onLogoUpdate, companyName }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo do arquivo é de 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload file
      setIsUploading(true);
      try {
        const logoUrl = await uploadCompanyLogo(file);
        if (logoUrl) {
          onLogoUpdate(logoUrl);
          toast({
            title: "Logo atualizado",
            description: "O logo da empresa foi atualizado com sucesso"
          });
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-32 h-32 border-2 border-border">
          <AvatarImage src={previewUrl || ''} alt="Logo da empresa" />
          <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
            {getInitials(companyName)}
          </AvatarFallback>
        </Avatar>
        
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Carregar logo
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Camera className="mr-2 h-4 w-4" />
          Tirar foto
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              setPreviewUrl(null);
              onLogoUpdate('');
            }}
            disabled={isUploading}
          >
            <X className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default LogoUpload;
