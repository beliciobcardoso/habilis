'use client';
import { redirect } from "next/navigation"
import { PrimeReactProvider } from "primereact/api"
import { Button } from "primereact/button";
import { Splitter, SplitterPanel } from "primereact/splitter";
import FolderTree, { FolderTreeRef } from "@/components/FileManager/FolderTree";
import FileViewer from "@/components/FileManager/FileViewer";
import FolderView from "@/components/FileManager/FolderView";
import { useRef, useState } from "react";
import type { FileType, FolderType } from "@/lib/types";
import { Dialog } from "primereact/dialog";
import { useSession } from "next-auth/react";

import 'primeicons/primeicons.css';


export default function Page4() {
    const { data: session } = useSession();
    if (!session?.user) redirect("/login");

    const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [mensagemAlerta, setMensagemAlerta] = useState('');
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [mensagensErros, setMensagensErros] = useState<{ [key: string]: string }>({});
    const folderTreeRef = useRef<FolderTreeRef>(null);

    const handleFolderSelect = (folder: FolderType) => {
        console.log("Pasta selecionada:", folder);
        setSelectedFolder(folder);
        setSelectedFile(null); // Limpa o arquivo selecionado quando seleciona uma pasta
    };

    const handleFileSelect = (file: FileType) => {
        console.log("Arquivo selecionado:", file);
        setSelectedFile(file);
    };

    const handleBackToFolder = () => {
        setSelectedFile(null);
    };

    const openNewFolderDialog = () => {
        if (!selectedFolder) {
            const mensagemAlerta = 'Selecione uma pasta para criar uma nova pasta';
            setMensagemAlerta(mensagemAlerta);
            setIsAlertVisible(true);
            return;
        }

        setIsDialogVisible(true);
    };

    const createNewFolder = async () => {
        if (newFolderName.trim() === '') {
            setMensagensErros({ ...mensagensErros, nome: 'O nome da pasta é obrigatório' });
            return;
        }

        // Lógica para criar a nova pasta
        const response = await fetch('/api/folders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newFolderName,
                userId: session?.user?.id,
                selectedFolder
            }),
        });

        if (response.ok) {
            console.log('Nova pasta criada com sucesso');

            // Obter dados da pasta recém-criada
            const newFolder = await response.json();

            // Fechar o diálogo e limpar o formulário
            setIsDialogVisible(false);
            setNewFolderName('');
            setMensagensErros({});

            // Recarregar a árvore de pastas e selecionar a nova pasta
            if (folderTreeRef.current) {
                // Recarregar a árvore de pastas
                await folderTreeRef.current.reloadFolders();

                // Selecionar a nova pasta após um pequeno delay para garantir que a árvore foi atualizada
                setTimeout(() => {
                    if (newFolder && newFolder.id) {
                        folderTreeRef.current?.selectFolder(newFolder.id);
                    }
                }, 100);
            }
        } else {
            console.error('Erro ao criar nova pasta');
        }
    };

    return (
        <PrimeReactProvider>
            <main className="min-h-screen py-4 px-2 flex justify-center w-full">
                <div className="w-full max-w-[2500px]">
                    <header className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Gerenciador de Transações</h1>
                            <p className="text-gray-400">Gerencie dados de trasanções finaceiras, comprovantes e outros arquivos associados.</p>
                        </div>
                    </header>
                    <Splitter className="border border-slate-700/50 bg-gray-500 p-0 m-0" style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                        <SplitterPanel size={15} minSize={10} className="overflow-auto bg-slate-600">
                            <div className="p-4">
                                <div className='flex items-center gap-2 mb-4'>
                                    <Button
                                        label=""
                                        icon="pi pi-plus"
                                        onClick={openNewFolderDialog}
                                        className="bg-gray-300 hover:bg-gray-200 px-3 rounded-full"
                                    />
                                    <h2 className="text-xl font-bold flex items-center">
                                        <i className="pi pi-folder mr-2 text-yellow-500"></i>
                                        Pastas
                                    </h2>
                                </div>
                                <FolderTree
                                    ref={folderTreeRef}
                                    onFolderSelect={handleFolderSelect}
                                />
                            </div>
                        </SplitterPanel>

                        <SplitterPanel size={77} minSize={60} className="overflow-auto w-full">
                            {selectedFile ? (
                                <FileViewer
                                    file={selectedFile}
                                    onBack={handleBackToFolder}
                                />
                            ) : (
                                <FolderView
                                    folder={selectedFolder}
                                    onFileSelect={handleFileSelect}
                                />
                            )}
                        </SplitterPanel>
                    </Splitter>
                </div>

                <Dialog
                    header="Atenção"
                    className="bg-slate-800/90 p-4 text-gray-200 rounded-lg"
                    headerClassName="bg-slate-800/90 text-red-400"
                    visible={isAlertVisible}
                    style={{ width: '500px', maxWidth: '98vw' }}
                    modal
                    onHide={() => setIsAlertVisible(false)}
                    footer={
                        <div className="flex justify-end gap-2">
                            <Button label="OK" onClick={() => setIsAlertVisible(false)} className="bg-gray-400 rounded-sm px-4 py-2 text-gray-900 hover:bg-slate-100" />
                        </div>
                    }
                >
                    <div className="p-fluid">
                        <p className="text-lg text-gray-200">{mensagemAlerta}</p>
                    </div>
                </Dialog>

                <Dialog
                    header="Nova Pasta"
                    className="bg-slate-800/90 p-4 text-gray-200 rounded-lg gap-4"
                    visible={isDialogVisible}
                    style={{ width: '500px', maxWidth: '98vw' }}
                    modal
                    onHide={() => setIsDialogVisible(false)}
                    footer={
                        <div className="flex justify-end gap-4">
                            <Button label="Cancelar" onClick={() => setIsDialogVisible(false)} className="bg-red-700 rounded-sm px-4 py-2 text-gray-400 hover:bg-red-300 hover:text-gray-900" />
                            <Button label="Criar" onClick={createNewFolder} className="bg-gray-400 rounded-sm px-4 py-2 text-gray-900 hover:bg-slate-100" />
                        </div>
                    }
                >
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="newFolderName" className="p-d-block sr-only">Nova pasta</label>
                            <input
                                id="newFolderName"
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="text-gray-900 text-lg w-full py-2 px-4"
                                placeholder="Nome da nova pasta"
                            />
                        </div>
                        {mensagensErros.nome && newFolderName.length === 0 && (
                            <small className="text-red-600 block mt-2">{mensagensErros.nome}</small>
                        )}
                    </div>
                </Dialog>

            </main>
        </PrimeReactProvider>
    )
}

