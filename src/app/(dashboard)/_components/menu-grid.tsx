import { MenuItem } from "./menu-item"


export function MenuGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
      <MenuItem 
        href={'/page1'} 
        src={'/Captura de tela de 2025-01-26 09-47-14.png'} 
        title="GERENCIAMENTO DE PROJETOS"
        isActive={true}
      />
      <MenuItem   
        href={'/'} 
        src={'/Captura de tela de 2025-01-26 09-31-53.png'} 
        title="SMART CONSTRACTS"
        isActive={false}
      />
      <MenuItem 
        href={'/'} 
        src={'/Captura de tela de 2025-01-26 09-31-21.png'} 
        title="EQUIPES"
      />
      <MenuItem 
        href={'/'} 
        src={'/Captura de tela de 2025-01-26 09-31-13.png'} 
        title="VISUALIZADOR BIM"
      />
      <MenuItem 
        href={'/page3'} 
        src={'/Captura de tela de 2025-01-26 09-31-37.png'} 
        title="GESTÃO DE CUSTOS"
      />
      <MenuItem 
        href={'/'} 
        src={'/Captura de tela de 2025-01-26 09-30-52.png'} 
        title="TRANSAÇÕES"
      />
    </div>
  )
}

