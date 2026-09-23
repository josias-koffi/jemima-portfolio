import { Fragment } from 'react'

export function Marquee({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((n) => (
            <p className="marquee__group" key={n}>
              {items.map((item, i) => (
                <Fragment key={i}>
                  <span>{item}</span>
                  <span className="marquee__star">✺</span>
                </Fragment>
              ))}
            </p>
          ))}
        </div>
      </div>
      <p className="sr-only">{items.join(', ')}</p>
    </>
  )
}
