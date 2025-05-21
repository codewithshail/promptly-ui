"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export interface CardData {
  id: string;
  name: string;
  description: string;
  subtitle: string | null;
  logo: string;
  screenshots: string[] | null;
  priceInfo: string | null;
  generationType: string;
  isNew: boolean | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}
interface WhatsNewProps {
  cardsData: CardData[];
}

export function WhatsNew({ cardsData }: WhatsNewProps) {
  const cards = cardsData.map((card, index) => (
    <Card key={card.logo} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <Carousel items={cards} />
    </div>
  );
}