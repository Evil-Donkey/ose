"use client";

import Container from "@/components/Container";
import { Spinner } from "@/components/Icons/Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-02 to-darkblue">
      <Container>
        <div className="text-center">
          <div className="mb-6">
            <Spinner size={48} className="text-white mx-auto" />
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">Loading...</h2>
        </div>
      </Container>
    </div>
  );
}
