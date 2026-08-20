async function loadNotes() {
    const container = document.getElementById('notes-container');
    
    try {
        const response = await fetch(`./posts/index.json`);
        
        if (!response.ok) {
            container.innerHTML = '<p>找不到索引。</p>';
            return;
        }

        const postsIndex = await response.json();

        if (postsIndex.length === 0) {
            container.innerHTML = '<p>目前沒有內容。</p>';
            return;
        }

        container.innerHTML = ''; 

        postsIndex.forEach(post => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note';

            noteDiv.innerHTML = `
                <div class="note-title">${post.title}</div>
                <div class="note-content">
                    <div class="note-description">載入中...</div>
                </div>
            `;

            const titleElement = noteDiv.querySelector('.note-title');
            const descElement = noteDiv.querySelector('.note-description');

            titleElement.addEventListener('click', async () => {
                const isExpanded = noteDiv.classList.toggle('expanded');

                if (isExpanded && !noteDiv.dataset.loaded) {
                    try {
                        const postRes = await fetch(`./posts/${post.id}.json`);
                        if (!postRes.ok) throw new Error();
                        
                        const postData = await postRes.json();

                        descElement.innerHTML = postData.description;
                        noteDiv.dataset.loaded = "true";
                    } catch (err) {
                        descElement.innerHTML = "無法載入內容，請稍後再試。";
                        console.error(`載入 ${post.id}.json 失敗`);
                    }
                }
            });

            container.appendChild(noteDiv);
        });

    } catch (error) {
        console.error("載入流程發生錯誤:", error);
        container.innerHTML = '<p>載入失敗，請檢查網路連線或稍後再試。</p>';
    }
}

window.addEventListener('DOMContentLoaded', loadNotes);