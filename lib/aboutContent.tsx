import React from "react";
import { Gem, ShieldCheck, Leaf } from "lucide-react";

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

export const aboutContent = (
    <div className="space-y-12">
        <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Sobre Nós</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
                Bem-vindo à nossa loja! Somos apaixonados por oferecer produtos de alta qualidade e uma experiência de compra excepcional. Nossa missão é trazer para você uma seleção cuidadosa de itens que combinam estilo, funcionalidade e durabilidade.
            </p>
        </div>

        <div className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nossos Valores</h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Acreditamos que cada item em nossa loja conta uma história e estamos felizes em compartilhar essas histórias com você.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                <Gem className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                                Qualidade
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">Selecionamos apenas os melhores produtos para garantir a sua satisfação.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                <ShieldCheck className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                                Atendimento ao Cliente
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">Estamos sempre aqui para ajudar e garantir que sua experiência seja perfeita.</p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                <Leaf className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                                Sustentabilidade
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                <p className="flex-auto">Buscamos trabalhar com marcas e produtos que compartilham nosso compromisso com o meio ambiente.</p>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">Nossa Galeria</h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((src, index) => (
                    <div key={index} className="overflow-hidden rounded-lg">
                        <img
                            src={src}
                            alt={`Galeria de imagens ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </div>
        
        <div className="text-center">
            <p className="mt-4 text-lg leading-8 text-gray-600">
                Obrigado por nos visitar. Esperamos que você encontre algo que ame!
            </p>
        </div>
    </div>
);
