import Header from "@/components/Header";
import StorefrontHero from "@/components/StorefrontHero";
import ProductCarousel from "@/components/ProductCarousel";
import VideoShowcase from "@/components/VideoShowcase";
import CustomOrderBanner from "@/components/CustomOrderBanner";
import HowItWorks from "@/components/HowItWorks";
import CraftSection from "@/components/CraftSection";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="pt-[68px] md:pt-[104px]">
        <StorefrontHero />

        <div id="featured">
          <ProductCarousel
            eyebrow="Editor's selection"
            title="Featured products"
            catalogueHref="/catalogue"
            catalogueLabel="All products"
            featured={true}
          />
        </div>
        <ProductCarousel
  eyebrow="Fresh from the studio"
  title="New arrivals"
  catalogueHref="/catalogue/?sort=new"
  catalogueLabel="Shop new"
  newArrival={true} // This filters only for your 29 new products!
/>

        <ProductCarousel
          eyebrow="Personalised gifting"
          title="Gifts they'll remember"
          catalogueHref="/catalogue/?category=Gifts"
          catalogueLabel="Shop gifts"
          category="Gifts"
        />

        <ProductCarousel
          eyebrow="For your space"
          title="Home & lifestyle"
          catalogueHref="/catalogue/?category=Home"
          catalogueLabel="Shop home"
          category="Home"
        />

        <ProductCarousel
          eyebrow="Keepsakes & plaques"
          title="Personalised keepsakes"
          catalogueHref="/catalogue/?category=Corporate"
          catalogueLabel="Shop keepsakes"
          category="Corporate"
        />

        <ProductCarousel
          eyebrow="Adorn your look"
          title="Jewellery"
          catalogueHref="/catalogue/?category=Jewellery"
          catalogueLabel="Shop jewellery"
          category="Jewellery"
        />

        <ProductCarousel
          eyebrow="Fine leather goods"
          title="Leather"
          catalogueHref="/catalogue/?category=Leather"
          catalogueLabel="Shop leather"
          category="Leather"
        />

        <ProductCarousel
          eyebrow="One-of-a-kind"
          title="Custom creations"
          catalogueHref="/catalogue/?category=Custom"
          catalogueLabel="Shop custom"
          category="Custom"
        />

        <ProductCarousel
          eyebrow="Fresh from the studio"
          title="New arrivals"
          catalogueHref="/catalogue/?sort=new"
          catalogueLabel="Shop new"
          newArrival={true}
        />

        <VideoShowcase />

        <CustomOrderBanner />
        <HowItWorks />
        <CraftSection />
        <TrustBar />
      </main>

      <Footer />
    </>
  );
}