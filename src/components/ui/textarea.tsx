import * as React from 'react';

import {cn} from '@/lib/utils';
import { useLayoutEffect } from 'react';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, value, ...props}, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const combinedRef = ref || internalRef;

    useLayoutEffect(() => {
      const target = combinedRef && 'current' in combinedRef ? combinedRef.current : null;
      if (target) {
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }
    }, [value, combinedRef]);

    return (
      <textarea
        value={value}
        className={cn(
          'flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={combinedRef}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
