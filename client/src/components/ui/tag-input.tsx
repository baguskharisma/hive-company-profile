import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagInput({ value = [], onChange, placeholder = 'Add tag...', disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      const newValue = inputValue.trim();
      if (newValue && !value.includes(newValue)) {
        onChange([...value, newValue]);
        setInputValue('');
      }
    }
  };

  const handleAddTag = () => {
    const newValue = inputValue.trim();
    if (newValue && !value.includes(newValue)) {
      onChange([...value, newValue]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-grow"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddTag}
          disabled={!inputValue.trim() || disabled}
        >
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 pt-2">
        {value.map((tag, i) => (
          <Badge variant="secondary" key={i} className="flex items-center gap-1">
            {tag}
            {!disabled && (
              <Button
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
}