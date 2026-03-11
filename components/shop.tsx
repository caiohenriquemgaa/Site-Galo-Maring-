import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ShopProduct } from "@/lib/site-content"

interface ShopProps {
  products: ShopProduct[]
}

function formatCurrency(price: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}

export function Shop({ products }: ShopProps) {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full mb-4">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Loja Oficial</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              VISTA A <span className="text-primary">CAMISA</span>
            </h2>
            <p className="text-muted-foreground mt-2">Produtos exclusivos para a torcida mais apaixonada</p>
          </div>

          <Button
            asChild
            variant="outline"
            className="font-heading uppercase tracking-wider gap-2 border-foreground/30 text-foreground hover:bg-foreground/10"
          >
            <Link href="/loja">
              Ver Loja Completa
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href="/loja"
              className="group relative bg-muted rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4">
                <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-primary font-bold">{formatCurrency(product.price)}</p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="flex items-center justify-center gap-2 font-heading text-sm uppercase tracking-wider text-primary-foreground">
                  <ShoppingBag className="w-4 h-4" />
                  Comprar Agora
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
