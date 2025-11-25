"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Gem, ShieldCheck, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const images = [
    "/fotos/2025-04-29 (1).webp",
    "/fotos/2025-04-29.webp",
    "/fotos/2025-05-29 (1).webp",
    "/fotos/2025-05-29 (10).webp",
    "/fotos/2025-05-29 (11).webp",
    "/fotos/2025-05-29 (12).webp",
    "/fotos/2025-05-29 (13).webp",
    "/fotos/2025-05-29 (2).webp",
    "/fotos/2025-05-29 (3).webp",
    "/fotos/2025-05-29 (4).webp",
    "/fotos/2025-05-29 (5).webp",
    "/fotos/2025-05-29 (6).webp",
    "/fotos/2025-05-29 (7).webp",
    "/fotos/2025-05-29 (8).webp",
    "/fotos/2025-05-29 (9).webp",
    "/fotos/2025-05-29.webp",
];

export const AboutContent = () => {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const total = images.length;

    const current = useMemo(() => images[index], [index]);

    const openAt = useCallback((i: number) => {
        setIndex(i);
        setOpen(true);
    }, []);

    const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);
    const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);

    return (
        <div className="space-y-16">
            <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-[#1c274c]">Sobre Nós</h2>
                <p className="mt-4 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
                    Bem-vindo à nossa loja. Oferecemos produtos de alta qualidade com uma experiência de compra cuidada, unindo estilo, funcionalidade e durabilidade.
                </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white py-12 rounded-2xl border border-gray-200">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Nossos Valores</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">Cada artigo conta uma história que temos orgulho em partilhar.</p>
                    </div>
                    <div className="mx-auto mt-12 lg:mt-16 lg:max-w-none">
                        <dl className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Gem className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                                    Qualidade
                                </dt>
                                <dd className="mt-3 text-base leading-7 text-gray-600">Selecionamos apenas os melhores produtos para a sua satisfação.</dd>
                            </div>
                            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <ShieldCheck className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                                    Atendimento ao Cliente
                                </dt>
                                <dd className="mt-3 text-base leading-7 text-gray-600">Acompanhamento próximo para uma experiência perfeita de compra.</dd>
                            </div>
                            <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-xs">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Leaf className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                                    Sustentabilidade
                                </dt>
                                <dd className="mt-3 text-base leading-7 text-gray-600">Compromisso com marcas alinhadas ao cuidado ambiental.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Galeria</h3>
                <p className="text-center text-gray-600 mt-2">Clique nas imagens para ver em tamanho grande.</p>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => openAt(i)}
                            aria-label={`Abrir imagem ${i + 1}`}
                            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white"
                        >
                            <img
                                src={src}
                                alt={`Galeria ${i + 1}`}
                                className="w-full h-40 md:h-48 lg:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </button>
                    ))}
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <span />
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl bg-transparent border-none shadow-none p-0">
                        <div className="relative bg-white rounded-2xl p-2 md:p-4">
                            <img src={current} alt="Imagem ampliada" className="w-full max-h-[80vh] object-contain rounded-xl" />
                            <div className="absolute inset-y-4 left-4 flex items-center">
                                <button onClick={prev} className="p-2 md:p-3 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50" aria-label="Anterior">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="absolute inset-y-4 right-4 flex items-center">
                                <button onClick={next} className="p-2 md:p-3 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50" aria-label="Seguinte">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="text-center">
                <p className="mt-4 text-lg leading-8 text-gray-600">Obrigado por nos visitar. Esperamos que encontre algo que ame.</p>
            </div>
        </div>
    );
};
