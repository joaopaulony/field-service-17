
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { X, Plus } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onChange }) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Tags</FormLabel>
      <div className="flex items-center mb-2">
        <Input
          placeholder="Adicionar tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-2"
          onClick={handleTagAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => handleTagRemove(tag)}
              className="rounded-full hover:bg-muted ml-1"
              aria-label={`Remover tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
