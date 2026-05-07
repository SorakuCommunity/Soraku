import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Ketentuan Penggunaan | Soraku' }
export default function TosPage() {
    return (
     <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
       <h1 className="mb-2 text-3xl font-black">Ketentuan Penggunaan</h1>
       <p className="text-muted-foreground/60 mb-10 text-sm">
         Terakhir diperbarui: 29 Maret 2026 &middot; Berlaku sejak 10 Februari 2026
       </p>
       
        <div className="text-muted-foreground/80 space-y-8 text-sm leading-relaxed">
           <section>
             <h2 className="text-foreground mb-3 text-lg font-black">1. Penerimaan Ketentuan</h2>
             <p>
               Selamat datang di Soraku (&ldquo;Soraku&rdquo;, &ldquo;kami&rdquo;). Dengan
               <br />
               <br />
               Ketentuan Penggunaan ini berlaku untuk seluruh layanan Soraku. &copy;
               <br />
               <br />
               2023&ndash;2026 Soraku. Seluruh hak dilindungi.
             </p>
           </section>
        </div>
     </div>
   )
}
