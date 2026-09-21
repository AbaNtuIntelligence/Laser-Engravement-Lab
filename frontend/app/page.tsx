import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
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

      <main>

  <HeroSlider />

  <CategoryRail />

  <div id="featured">
    <ProductCarousel
      eyebrow="Editor's selection"
      title="Featured products"
      featured={true}
    />
  </div>

  <div id="featured">
  <ProductCarousel
    eyebrow="Editor's selection"
    title="Featured products"
    featured={true}
  />
</div>

<VideoShowcase />

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

  <CraftSection />

  <TrustBar />

</main>

      <Footer />

    </>

  );
}
