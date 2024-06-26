import dynamic from 'next/dynamic';
import * as React from 'react';
import 'react-quill/dist/quill.snow.css';
interface RichEditorProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
}
export const RichEditor = React.forwardRef<any, RichEditorProps>(
  ({ placeholder, onChange, value }, ref) => {
    const ReactQuill = React.useMemo(
      () => dynamic(() => import("react-quill"), { ssr: false }),
      []
    );
    return (
      <div>
        <ReactQuill
          theme='snow'
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
);
RichEditor.displayName = 'RichEditor';
