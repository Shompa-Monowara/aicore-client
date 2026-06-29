"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Spinner } from "@heroui/react";

import Banner from "@/components/Banner";
import FeaturedPrompts from "@/components/FeaturedPrompts";
import WhyChooseUs from "@/components/WhyChooseUs";

import ExtraSections from "@/components/ExtraSections";
import TopCreators from "@/components/TopCreators";
import CustomerReviews from "@/components/CustomerReviews";
import { getFeaturedPrompts, getTopCreators, getAllPublicReviews } from "@/lib/api/prompts";


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  
  const [featured, setFeatured] = useState([]);
  const [creators, setCreators] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    async function loadAllHomeData() {
      try {
        const [featuredData, creatorsData, reviewsData] = await Promise.all([
          getFeaturedPrompts(),
          getTopCreators(),
          getAllPublicReviews()
        ]);
        
        setFeatured(featuredData || []);
        setCreators(creatorsData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Failed to load marketplace data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllHomeData();
  }, []);

  
  const handleViewDetails = (promptId) => {
    if (!user) {
      router.push("/auth/login");
    } else {
      router.push(`/all-prompts/${promptId}`);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-[#080810] text-white min-h-screen overflow-x-hidden font-sans">
    
      <Banner />

    
      <FeaturedPrompts 
        featured={featured} 
        handleViewDetails={handleViewDetails} 
        containerVariants={staggerContainer} 
        fadeInUp={fadeInUp} 
      />
      
      
      <WhyChooseUs />
      
      
      <TopCreators 
        creators={creators} 
        containerVariants={staggerContainer} 
        fadeInUp={fadeInUp} 
      />
      
     
      <CustomerReviews
        reviews={reviews} 
        containerVariants={staggerContainer} 
        fadeInUp={fadeInUp} 
      />
      
      
      <ExtraSections fadeInUp={fadeInUp} />
    </div>
  );
}