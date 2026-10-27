import Header from "@/components/Header";
import StorefrontHero from "@/components/StorefrontHero";
import CategoryRail from "@/components/CategoryRail";
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

  <CategoryRail />

  <div id="featured">
    <ProductCarousel
      eyebrow="Editor's selection"
      title="Featured products"
      featured={true}
    />
  </div>


<ProductCarousel
  eyebrow="Personalised gifting"
  title="Gifts they'll remember"
  category="Gifts"
/>

<ProductCarousel
  eyebrow="For your space"
  title="Home & lifestyle"
  category="Home"
/>

<ProductCarousel
  eyebrow="Business & events"
  title="Corporate & branded"
  category="Corporate"
/>

<ProductCarousel
  eyebrow="Fresh from the studio"
  title="New arrivals"
  newArrival={true}
/>

  <CustomOrderBanner />

  <HowItWorks />

  <VideoShowcase />
  <CraftSection />

  <TrustBar />

</main>

      <Footer />

    </>

  );
}

