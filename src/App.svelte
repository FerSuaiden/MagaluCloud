<!-- App.svelte -->
<script>
  // @ts-check
  import { onMount } from 'svelte';

  // File system state
  let files = [
    { id: 1, name: 'Documents', type: 'folder', parent: null },
    { id: 2, name: 'Images', type: 'folder', parent: null },
    { id: 3, name: 'report.pdf', type: 'file', size: 2500000, parent: 1 },
    { id: 4, name: 'vacation.jpg', type: 'file', size: 5000000, parent: 2 },
  ];

  let currentFolder = null;
  let usedSpace = 7500000; // 7.5MB
  let totalSpace = 15000000; // 15MB
  let selectedFile = null;
  let showRenameDialog = false;
  let newFileName = '';

  // Format file size to human-readable format
  function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  // Get files in current folder
  $: currentFiles = files.filter(file => file.parent === currentFolder);

  // Handle file upload
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if there's enough space
    if (usedSpace + file.size > totalSpace) {
      alert('Not enough storage space!');
      return;
    }

    const newFile = {
      id: files.length + 1,
      name: file.name,
      type: 'file',
      size: file.size,
      parent: currentFolder
    };

    files = [...files, newFile];
    usedSpace += file.size;
  }

  // Handle file/folder deletion
  function handleDelete(item) {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;

    if (item.type === 'folder') {
      // Delete folder and all its contents
      const itemsToDelete = files.filter(f => f.parent === item.id);
      usedSpace -= itemsToDelete.filter(f => f.type === 'file').reduce((acc, f) => acc + f.size, 0);
      files = files.filter(f => f.parent !== item.id);
    } else {
      usedSpace -= item.size;
    }
    files = files.filter(f => f.id !== item.id);
  }

  // Handle navigation
  function navigateToFolder(folderId) {
    currentFolder = folderId;
  }

  // Handle create new folder
  function createFolder() {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder = {
      id: files.length + 1,
      name: folderName,
      type: 'folder',
      parent: currentFolder
    };

    files = [...files, newFolder];
  }

  // Start rename process
  function startRename(file) {
    selectedFile = file;
    newFileName = file.name;
    showRenameDialog = true;
  }

  // Complete rename process
  function completeRename() {
    if (!newFileName.trim()) return;
    
    files = files.map(f => 
      f.id === selectedFile.id 
        ? { ...f, name: newFileName }
        : f
    );
    
    showRenameDialog = false;
    selectedFile = null;
    newFileName = '';
  }
</script>

<main class="container mx-auto p-4 max-w-4xl">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Simple File Storage</h1>
    <div class="space-x-2">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        on:click={createFolder}
      >
        New Folder
      </button>
      <label class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">
        Upload File
        <input
          type="file"
          class="hidden"
          on:change={handleFileUpload}
        />
      </label>
    </div>
  </div>

  <!-- Navigation -->
  <div class="flex items-center space-x-2 mb-4">
    <button
      class="text-blue-500 hover:underline"
      on:click={() => navigateToFolder(null)}
    >
      Root
    </button>
    {#if currentFolder}
      <span>/</span>
      <span>{files.find(f => f.id === currentFolder)?.name}</span>
    {/if}
  </div>

  <!-- File List -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="divide-y">
      {#each currentFiles as item}
        <div class="flex items-center justify-between p-4 hover:bg-gray-50">
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">
              {item.type === 'folder' ? '📁' : '📄'}
            </span>
            <span
              class="cursor-pointer"
              on:click={() => item.type === 'folder' && navigateToFolder(item.id)}
            >
              {item.name}
            </span>
            {#if item.type === 'file'}
              <span class="text-sm text-gray-500">
                ({formatSize(item.size)})
              </span>
            {/if}
          </div>
          <div class="space-x-2">
            <button
              class="text-blue-500 hover:text-blue-600"
              on:click={() => startRename(item)}
            >
              Rename
            </button>
            <button
              class="text-red-500 hover:text-red-600"
              on:click={() => handleDelete(item)}
            >
              Delete
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Storage Usage -->
  <div class="mt-6">
    <div class="flex justify-between text-sm text-gray-600 mb-2">
      <span>Storage Used: {formatSize(usedSpace)}</span>
      <span>Total: {formatSize(totalSpace)}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="bg-blue-600 h-2.5 rounded-full"
        style="width: {(usedSpace / totalSpace) * 100}%"
      ></div>
    </div>
  </div>

  <!-- Rename Dialog -->
  {#if showRenameDialog}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h2 class="text-xl font-bold mb-4">Rename Item</h2>
        <input
          type="text"
          bind:value={newFileName}
          class="border p-2 rounded w-full mb-4"
        />
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            on:click={() => showRenameDialog = false}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={completeRename}
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    @apply bg-gray-50;
  }
</style>
