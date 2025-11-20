import React from "react";

export const policyContent: Record<string, React.ReactNode> = {
  privacy: (
    <div className="prose max-w-none">
      <h2>Introdução</h2>
      <p>
        Esta Política de Privacidade descreve como coletamos, utilizamos e protegemos seus dados pessoais
        em conformidade com a Lei Geral de Proteção de Dados (LGPD - Brasil) e o Regulamento Geral sobre a
        Proteção de Dados (GDPR - União Europeia).
      </p>
      <h2>Dados coletados</h2>
      <ul>
        <li>Dados de conta: nome, e-mail, telefone e endereço.</li>
        <li>Dados de pedido: itens, valores, status de pagamento e entrega.</li>
        <li>Dados técnicos: endereço IP, identificadores de dispositivo, cookies e logs.</li>
      </ul>
      <h2>Bases legais</h2>
      <ul>
        <li>Execução de contrato: processamento de pedidos e prestação de serviços.</li>
        <li>Consentimento: envio de comunicações de marketing e uso de cookies não essenciais.</li>
        <li>Interesse legítimo: melhorias de produto, prevenção a fraudes e segurança.</li>
        <li>Obrigação legal: emissão de documentos fiscais e cumprimento regulatório.</li>
      </ul>
      <h2>Uso dos dados</h2>
      <ul>
        <li>Processar compras, pagamentos e entregas.</li>
        <li>Atendimento e suporte ao cliente.</li>
        <li>Personalização de experiência e recomendações.</li>
        <li>Mensuração, estatísticas e otimização do site.</li>
      </ul>
      <h2>Compartilhamento</h2>
      <p>
        Podemos compartilhar dados com provedores de pagamento, logística, hospedagem e ferramentas de
        analytics, sempre sob contratos e medidas de segurança adequadas.
      </p>
      <h2>Retenção</h2>
      <p>
        Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas e obrigações legais.
        Após esse período, dados são anonimizados ou excluídos de forma segura.
      </p>
      <h2>Direitos do titular</h2>
      <ul>
        <li>Acesso, correção e exclusão.</li>
        <li>Revogação de consentimento e oposição.</li>
        <li>Portabilidade e informação sobre compartilhamentos.</li>
        <li>Reclamação à ANPD (Brasil) ou autoridade de proteção de dados competente.</li>
      </ul>
      <h2>Cookies e rastreamento</h2>
      <p>
        Utilizamos cookies necessários e, mediante consentimento, cookies de preferências, estatística e
        marketing. Você pode gerenciar suas preferências no banner ou na página de Cookies.
      </p>
      <h2>Segurança</h2>
      <p>
        Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados,
        perda ou alteração.
      </p>
      <h2>Contato</h2>
      <p>
        Para exercer seus direitos ou tirar dúvidas, entre em contato pelos canais informados em nossa página
        de Contato.
      </p>
      <h2>Atualizações</h2>
      <p>
        Podemos atualizar esta política periodicamente. Consulte esta página para ver a versão vigente.
      </p>
    </div>
  ),
  terms: (
    <div className="prose max-w-none">
      <h2>Aceitação dos Termos</h2>
      <p>
        Ao acessar e utilizar nossos serviços, você concorda com estes Termos de Uso. Caso não concorde,
        não deverá utilizar o site.
      </p>
      <h2>Cadastro e Conta</h2>
      <p>
        Você é responsável por manter a confidencialidade das credenciais e pela veracidade das informações
        fornecidas.
      </p>
      <h2>Compras e Pagamentos</h2>
      <ul>
        <li>Preços e condições podem variar e serão exibidos no momento da compra.</li>
        <li>Pedidos estão sujeitos à confirmação e disponibilidade de estoque.</li>
        <li>Fraudes ou uso indevido podem levar ao cancelamento do pedido.</li>
      </ul>
      <h2>Entregas e Devoluções</h2>
      <p>
        As políticas de entrega, troca e devolução são apresentadas durante o checkout e em nossas páginas
        informativas.
      </p>
      <h2>Propriedade Intelectual</h2>
      <p>
        Conteúdos, marcas e materiais disponíveis são protegidos por direitos autorais e de propriedade
        intelectual. É vedada a reprodução sem autorização.
      </p>
      <h2>Limitação de Responsabilidade</h2>
      <p>
        Na extensão máxima permitida em lei, não nos responsabilizamos por danos indiretos, lucros cessantes
        ou perda de dados decorrentes do uso do site.
      </p>
      <h2>Proibições</h2>
      <ul>
        <li>Uso para fins ilegais ou não autorizados.</li>
        <li>Interferência na segurança ou operação do site.</li>
        <li>Violação de direitos de terceiros.</li>
      </ul>
      <h2>Rescisão</h2>
      <p>
        Podemos suspender ou encerrar o acesso por violação destes termos ou quando exigido por lei.
      </p>
      <h2>Alterações</h2>
      <p>
        Podemos atualizar estes termos. A continuidade de uso após mudanças implica concordância com a versão
        atualizada.
      </p>
      <h2>Foro</h2>
      <p>
        Fica eleito o foro de nossa sede, salvo legislação aplicável em contrário.
      </p>
    </div>
  ),
  cookies: (
    <div className="prose max-w-none">
      <h2>O que são cookies?</h2>
      <p>
        Cookies são pequenos arquivos armazenados no seu dispositivo que ajudam a lembrar preferências,
        entender como o site é usado e oferecer funcionalidades.
      </p>
      <h2>Categorias de cookies</h2>
      <ul>
        <li>Necessários: essenciais para funcionamento do site. Sempre ativos.</li>
        <li>Preferências: lembram escolhas como idioma e região.</li>
        <li>Estatística: ajudam a medir e melhorar desempenho.</li>
        <li>Marketing: usados para personalizar ofertas e publicidade.</li>
      </ul>
      <h2>Base legal e consentimento</h2>
      <p>
        Em conformidade com LGPD e GDPR, cookies não essenciais só são ativados com seu consentimento. Você
        pode gerenciar preferências pelo banner ou no link “Preferências de Cookies”.
      </p>
      <h2>Como controlar cookies</h2>
      <ul>
        <li>Use o nosso painel de preferências para ativar/desativar categorias.</li>
        <li>Configure seu navegador para bloquear ou apagar cookies.</li>
      </ul>
      <h2>Retenção</h2>
      <p>
        O tempo de retenção varia conforme o tipo de cookie. Cookies de sessão expiram ao sair; cookies
        persistentes têm duração limitada conforme a finalidade.
      </p>
      <h2>Atualizações</h2>
      <p>
        Podemos atualizar esta política de cookies. Verifique regularmente para se manter informado.
      </p>
    </div>
  ),
};