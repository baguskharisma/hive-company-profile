import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState, KeyboardEvent } from "react"

interface TagInputProps {
  placeholder?: string
  tags: string[]
  onTagsChange: (tags: string[]) => void
  disabled?: boolean
}

export function TagInput({
  placeholder,
  tags,
  onTagsChange,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim()
    
    if (!trimmedTag) return
    if (tags.includes(trimmedTag)) return
    
    onTagsChange([...tags, trimmedTag])
    setInputValue("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-background">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="h-7 px-3">
          {tag}
          <button
            type="button"
            className="ml-2 focus:outline-none"
            onClick={() => handleRemoveTag(tag)}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        placeholder={tags.length === 0 ? placeholder : undefined}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => handleAddTag(inputValue)}
        className="flex-1 min-w-[8rem] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
        disabled={disabled}
      />
    </div>
  )
}