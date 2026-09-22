import { Suspense } from "react";
import CatalogueClient from "./CatalogueClient";

function CatalogueLoading() {
  return (
    <main className="min-h-screen bg-[var(--store-paper)]">
      <div className="store-container py-24 text-center">
        <p className="text-sm text-[var(--store-muted)]">
          Loading catalogue...
        </p>
      </div>
    </main>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<CatalogueLoading />}>
      <CatalogueClient />
    </Suspense>
  );
}
