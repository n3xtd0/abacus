import type { PropsWithChildren } from 'react'

interface ResponsiveGridProps {
  itemCount: number
  columnsBase?: number
  columnsMd?: number
  columnsLg?: number
}

export const ResponsiveGrid = ({
  itemCount,
  children,
  columnsBase = 1,
  columnsMd = 2,
  columnsLg = 3,
}: PropsWithChildren<ResponsiveGridProps>) => {
  const numRowsLg = Math.ceil(itemCount / columnsLg)
  const numRowsMd = Math.ceil(itemCount / columnsMd)

  return (
    <>
      <style>{`
        .levels-responsive-grid {
          grid-template-rows: repeat(${itemCount}, minmax(0, 1fr));
          grid-template-columns: repeat(${columnsBase}, minmax(0, 1fr));
        }
        @media (min-width: 768px) {
          .levels-responsive-grid {
            grid-template-rows: repeat(${numRowsMd}, minmax(0, 1fr));
            grid-template-columns: repeat(${columnsMd}, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .levels-responsive-grid {
            grid-template-rows: repeat(${numRowsLg}, minmax(0, 1fr));
            grid-template-columns: repeat(${columnsLg}, minmax(0, 1fr));
          }
        }
      `}</style>
      <div className="levels-responsive-grid grid grid-flow-col gap-3 mt-3">{children}</div>
    </>
  )
}
