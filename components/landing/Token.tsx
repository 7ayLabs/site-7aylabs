"use client";

import Image from "next/image";
import ContentBlock from "@/components/ui/ContentBlock";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ROUTES } from "@/lib/constants/routes";

export default function Token() {
  return (
    <section aria-label="7AY Token" className="relative w-full section-padding">
      <div className="section-container">
        <ContentBlock
          label="TOKEN"
          title="What is $7AY?"
          illustrationSide="left"
          illustration={
            <Image
              src="/7ay_token.svg"
              alt="$7AY token illustration"
              width={240}
              height={240}
              className="w-48 h-48 md:w-60 md:h-60 select-none"
            />
          }
          cta={
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Button href={ROUTES.roadmap} variant="primary" size="md">
                View Roadmap
              </Button>
              <Badge variant="accent" className="py-2 px-4">
                Protocol v0.8
              </Badge>
            </div>
          }
        >
          <p>
            $7AY is the native token of the 7aychain ecosystem. It powers
            validator staking, presence attestation, governance participation,
            and protocol-level incentive alignment.
          </p>
          <p>
            Validators stake $7AY to participate in witness circles and earn
            rewards for honest triangulation. The token ensures economic
            security — malicious validators face on-chain slashing.
          </p>
          <p>
            Unlike speculative tokens, $7AY derives value from real
            participation. Every use of the token is tied to physical
            presence verification and protocol utility.
          </p>
        </ContentBlock>
      </div>
    </section>
  );
}
