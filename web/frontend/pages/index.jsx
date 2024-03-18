import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

export default function HomePage() {
  const productCount = useAppQuery({
        url: "/api/products",
        reactQueryOptions: {
            onSuccess: () => {
                // setIsLoading(false);
            },
        },
    });

    console.log("productsCount=", productCount);
  return (
    <h1>Hello World</h1>
  );
}
