import { InlineMath } from 'react-katex'

export function MathText({ value }: { value: string }) {
  return <>{value.split(/(\$[^$\n]+\$|\\\(.+?\\\))/g).map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return <InlineMath key={index} math={part.slice(1, -1)} />
    }
    if (part.startsWith('\\(') && part.endsWith('\\)')) {
      return <InlineMath key={index} math={part.slice(2, -2)} />
    }
    return part
  })}</>
}
