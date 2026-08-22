declare module 'react-katex' {
  import type { ComponentType, ReactNode } from 'react'

  type KatexProps = {
    math: string
    errorColor?: string
    renderError?: (error: Error) => ReactNode
  }

  export const BlockMath: ComponentType<KatexProps>
  export const InlineMath: ComponentType<KatexProps>
}
