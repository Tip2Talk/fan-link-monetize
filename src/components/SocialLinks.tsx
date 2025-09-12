import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Instagram, 
  MessageSquare, 
  Youtube, 
  Facebook, 
  Mail, 
  MessageCircle,
  ExternalLink,
  Globe,
  Heart,
  ShoppingBag
} from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  instagram?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

const getPlatformIcon = (platform: string) => {
  const iconProps = { className: "w-4 h-4" };
  
  switch (platform.toLowerCase()) {
    case 'instagram':
      return <Instagram {...iconProps} />;
    case 'twitter':
    case 'x':
      return <MessageSquare {...iconProps} />;
    case 'youtube':
      return <Youtube {...iconProps} />;
    case 'facebook':
      return <Facebook {...iconProps} />;
    case 'email':
      return <Mail {...iconProps} />;
    case 'whatsapp':
      return <MessageCircle {...iconProps} />;
    case 'onlyfans':
      return <Heart {...iconProps} />;
    case 'amazon':
      return <ShoppingBag {...iconProps} />;
    case 'website':
      return <Globe {...iconProps} />;
    case 'tiktok':
      return <MessageSquare {...iconProps} />;
    default:
      return <ExternalLink {...iconProps} />;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600';
    case 'twitter':
    case 'x':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'youtube':
      return 'bg-red-500 hover:bg-red-600';
    case 'facebook':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'tiktok':
      return 'bg-black hover:bg-gray-800';
    case 'onlyfans':
      return 'bg-blue-400 hover:bg-blue-500';
    case 'amazon':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'whatsapp':
      return 'bg-green-500 hover:bg-green-600';
    case 'email':
      return 'bg-gray-600 hover:bg-gray-700';
    default:
      return 'bg-primary hover:bg-primary/90';
  }
};

const formatUrl = (platform: string, url: string) => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle email
  if (platform === 'email') {
    return url.includes('@') ? `mailto:${url}` : `mailto:${url}`;
  }
  
  // Handle WhatsApp
  if (platform === 'whatsapp') {
    const cleanNumber = url.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanNumber}`;
  }
  
  // Handle username/handle formats
  const cleanUrl = url.replace('@', '');
  
  switch (platform.toLowerCase()) {
    case 'instagram':
      return `https://instagram.com/${cleanUrl}`;
    case 'twitter':
    case 'x':
      return `https://x.com/${cleanUrl}`;
    case 'youtube':
      return url.includes('channel/') || url.includes('c/') 
        ? `https://youtube.com/${cleanUrl}`
        : `https://youtube.com/@${cleanUrl}`;
    case 'facebook':
      return `https://facebook.com/${cleanUrl}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanUrl}`;
    case 'onlyfans':
      return `https://onlyfans.com/${cleanUrl}`;
    case 'amazon':
      return url.includes('amazon.') ? url : `https://amazon.com/shops/${cleanUrl}`;
    default:
      return url.startsWith('www.') ? `https://${url}` : url;
  }
};

export default function SocialLinks({ instagram, socialLinks = [], className = "" }: SocialLinksProps) {
  const allLinks = [];
  
  // Add Instagram if provided
  if (instagram) {
    allLinks.push({ platform: 'instagram', url: instagram });
  }
  
  // Add other social links
  socialLinks.forEach(link => {
    if (link.platform && link.url) {
      allLinks.push(link);
    }
  });
  
  if (allLinks.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {allLinks.map((link, index) => (
        <Button
          key={index}
          size="sm"
          className={`text-white border-0 ${getPlatformColor(link.platform)}`}
          asChild
        >
          <a
            href={formatUrl(link.platform, link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            {getPlatformIcon(link.platform)}
            <span className="capitalize">{link.platform}</span>
          </a>
        </Button>
      ))}
    </div>
  );
}