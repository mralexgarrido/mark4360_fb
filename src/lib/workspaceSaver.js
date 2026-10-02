// Coalesce edits while keeping IndexedDB writes in order. A completed older
// write must never report a newer, still-pending edit as saved.
export function createWorkspaceSaver(write, onSaved, onError) {
  let pending = null;
  let running = false;
  let revision = 0;
  const drain = async () => {
    if (running) return;
    running = true;
    while (pending) {
      const next = pending;
      pending = null;
      try {
        await write(next.workspace);
        if (next.revision === revision) onSaved();
      } catch (error) {
        if (next.revision === revision) onError(error);
      }
    }
    running = false;
  };
  return {
    markDirty() { ++revision; },
    save(workspace) {
      pending = { workspace, revision: ++revision };
      void drain();
    },
  };
}
