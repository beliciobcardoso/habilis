'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { formatFileSize } from '@/lib/utils';
import type { FileType, FolderType } from '@/lib/types';
import { Dialog } from 'primereact/dialog';
import FileUpLoad from './FileUpLoad';

interface FolderViewProps {
  folder: FolderType | null;
  onFileSelect: (file: FileType) => void;
}

export default function FolderView({ folder, onFileSelect }: FolderViewProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const fetchFiles = useCallback(async () => {
    if (!folder) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/files?folderKey=${folder.key}`);
      if (!response.ok) throw new Error('Falha ao carregar arquivos!');

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Falha ao carregar arquivos!');
      }

      console.log('Dados recebidos da API:', result.data);

      // Verificando se os dados estão na estrutura esperada
      // Se não forem um array, tentamos converter
      let filesData = result.data || [];

      // Se foi retornado um objeto e não um array, tente extrair os valores
      if (filesData && typeof filesData === 'object' && !Array.isArray(filesData)) {
        filesData = Object.values(filesData);
      }

      // Garantir que cada item tenha as propriedades necessárias
      const validFiles = filesData.filter((file: Partial<FileType>) =>
        file && typeof file === 'object' && file.name && file.type
      );

      console.log('Arquivos válidos:', validFiles);
      setFiles(validFiles as FileType[]);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao carregar arquivos!',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    if (folder) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [folder, fetchFiles]);

  const dateTemplate = (rowData: FileType) => {
    return new Date(rowData.lastModified).toLocaleString();
  };

  const sizeTemplate = (rowData: FileType) => {
    return formatFileSize(rowData.size);
  };

  const fileIconTemplate = (rowData: FileType) => {
    const getFileIcon = (fileType: string) => {
      if (fileType.startsWith('image/')) return 'pi pi-image text-blue-400';
      if (fileType === 'application/pdf') return 'pi pi-file-pdf text-red-400';
      if (fileType.includes('spreadsheet')) return 'pi pi-file-excel text-green-400';
      if (fileType.includes('document')) return 'pi pi-file-word text-indigo-400';
      if (fileType.includes('presentation')) return 'pi pi-file-powerpoint text-orange-400';
      if (fileType.includes('text/')) return 'pi pi-file-edit text-yellow-400';
      return 'pi pi-file text-gray-400';
    };

    return (
      <div className="flex items-center">
        <i className={`${getFileIcon(rowData.type)} text-xl mr-2`}></i>
        <span>{rowData.name}</span>
      </div>
    );
  };

  const typeTemplate = (rowData: FileType) => {
    const getTypeLabel = (fileType: string) => {
      if (fileType.startsWith('image/')) return 'Imagem';
      if (fileType === 'application/pdf') return 'PDF';
      if (fileType.includes('spreadsheet')) return 'Planilha';
      if (fileType.includes('document')) return 'Documento';
      if (fileType.includes('presentation')) return 'Apresentação';
      if (fileType === 'text/plain') return 'Texto';
      if (fileType === 'text/markdown') return 'Markdown';
      if (fileType === 'application/zip') return 'Arquivo ZIP';
      return fileType.split('/').pop() || fileType;
    };

    const getBadgeSeverity = (fileType: string) => {
      if (fileType.startsWith('image/')) return 'info';
      if (fileType === 'application/pdf') return 'danger';
      if (fileType.includes('spreadsheet')) return 'success';
      if (fileType.includes('document')) return 'contrast';
      if (fileType.includes('presentation')) return 'warning';
      return 'secondary';
    };

    return (
      <Badge
        value={getTypeLabel(rowData.type)}
        severity={getBadgeSeverity(rowData.type)}
        className="text-xs"
      />
    );
  };

  const actionsTemplate = (rowData: FileType) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button
          icon="pi pi-eye"
          rounded
          text
          onClick={(e) => {
            e.stopPropagation();
            onFileSelect(rowData);
          }}
          tooltip="Visualizar"
          severity="info"
          className="hover:bg-blue-700/20"
        />
        <Button
          icon="pi pi-download"
          rounded
          text
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/api/files/download?fileId=${rowData.id}`, '_blank');
          }}
          tooltip="Baixar"
          severity="success"
          className="hover:bg-green-700/20"
        />
      </div>
    );
  };

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center text-white bg-slate-800/50 h-full">
        <i className="pi pi-folder-open text-5xl text-gray-400 mb-4"></i>
        <h3 className="text-xl font-medium mb-2">Nenhuma pasta selecionada</h3>
        <p className="text-gray-400">Selecione uma pasta para visualizar seu conteúdo</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Toast ref={toast} position="bottom-right" />

      <div className="flex justify-between items-center mb-4 bg-slate-700/50 p-3 rounded-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center">
            <i className="pi pi-folder-open text-yellow-500 mr-2"></i>
            {folder.name}
            {files.length > 0 && (
              <Badge value={files.length} severity="info" className="ml-2"></Badge>
            )}
          </h2>
          <p className="text-gray-300 text-sm mt-1">{folder.path}</p>
        </div>
        <Button
          label="Upload Arquivo"
          icon="pi pi-upload"
          className="p-button-outlined p-button-rounded p-button-success p-4"
          onClick={() => setIsDialogVisible(true)}
          raised
          text
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
          <span className="mt-3 text-white">Carregando arquivos...</span>
        </div>
      ) : (
        <DataTable
          value={files}
          paginator
          rows={10}
          loading={loading}
          emptyMessage={
            <div className="text-center p-6">
              <i className="pi pi-file-excel text-4xl text-gray-500 mb-3"></i>
              <p className="text-white">Nenhum arquivo encontrado nesta pasta</p>
            </div>
          }
          dataKey="id"
          onRowClick={(e) => onFileSelect(e.data as FileType)}
          className="cursor-pointer shadow-lg"
          stripedRows
          rowHover
          pt={{
            root: { className: 'bg-slate-800/80 border border-slate-700/50 rounded-lg overflow-hidden' },
            headerRow: { className: 'bg-slate-700/70 text-white' },

            // headerCell: { className: 'px-4 py-3' },
            bodyRow: { className: 'text-white border-b border-slate-700/30 hover:bg-slate-700/50 transition-colors' },
            // bodyCell: { className: 'px-4 py-3' }
          }}
        >
          <Column field="name" header="Nome" body={fileIconTemplate} sortable />
          <Column field="type" header="Tipo" body={typeTemplate} sortable style={{ width: '150px' }} />
          <Column field="size" header="Tamanho" body={sizeTemplate} sortable style={{ width: '120px' }} />
          <Column field="lastModified" header="Modificado em" body={dateTemplate} sortable style={{ width: '200px' }} />
          <Column body={actionsTemplate} header="Ações" style={{ width: '120px' }} />
        </DataTable>
      )}

      <Dialog
        header="Upload de Arquivo"
        visible={isDialogVisible}
        style={{ width: '800px', maxWidth: '98vw' }}
        modal
        onHide={() => setIsDialogVisible(false)}
      >
        <FileUpLoad />
      </Dialog>
    </div>
  );
}