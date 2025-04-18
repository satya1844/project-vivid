"use client";

import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card"; // Corrected import path
import "./CommunityCardsSection.css";

const CommunityCardsSection = () => {
  const cardsData = [
    { title: "Title 1", description: "Something short and simple here" },
    { title: "Title 2", description: "Something short and simple here" },
    { title: "Title 3", description: "Something short and simple here" },
    { title: "Title 4", description: "Something short and simple here" },
    { title: "Title 5", description: "Something short and simple here" },
  ];

  return (
    <section className="community-section">
      <CardContainer>
        {cardsData.map((card, index) => (
          <CardBody
            key={index}
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border"
          >
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {card.title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              {card.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="image-placeholder"></div>
            </CardItem>
          </CardBody>
        ))}
      </CardContainer>
    </section>
  );
};

export default CommunityCardsSection;