import { Tool, tools } from 'model'
import { ReactComponent as SelectIcon } from 'assets/icons/tools/select.svg'
import { ReactComponent as ConnectorsIcon } from 'assets/icons/tools/connectors.svg'
import { ReactComponent as ElementsIcon } from 'assets/icons/tools/elements.svg'

type ToolInfo = {
    id: Tool
    label: string
    icon: React.ComponentType
}

const toolsInfo: Record<Tool, ToolInfo> = {
    select: {
        id: 'select',
        label: 'Select',
        icon: SelectIcon,
    },
    elements: {
        id: 'elements',
        label: 'Elements',
        icon: ElementsIcon,
    },
    connectors: {
        id: 'connectors',
        label: 'Connectors',
        icon: ConnectorsIcon,
    },
}

export const getToolInfo = (tool: Tool): ToolInfo => toolsInfo[tool]

export const toolBarItems = tools.map((tool) => getToolInfo(tool))
