import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);
let db;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabase({ name: 'posts.db', location: 'default' });
  }
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY,
          userId INTEGER,
          title TEXT,
          body TEXT,
          imageUrl TEXT,
          caption TEXT,
          likes INTEGER DEFAULT 0,
          comments TEXT,
          username TEXT,
          profilePicture TEXT,
          reactions TEXT,
          timestamp TEXT,
          isSynced INTEGER DEFAULT 0
        )`,
        [],
        () => {
          console.log('Database initialized');
          resolve();
        },
        (_, error) => {
          console.error('DB Initialization Error:', error);
          reject(error);
        }
      );
    });
  });
};

export const savePostLocally = async (post) => {
  try {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO posts (
            id, userId, title, body, imageUrl, caption,
            likes, comments, username, profilePicture,
            reactions, timestamp, isSynced
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            post.id,
            post.userId || 1,
            post.title || '',
            post.body || post.caption || '',
            post.imageUrl || '',
            post.caption || '',
            post.likes || 0,
            JSON.stringify(post.comments || []),
            post.username || 'User',
            post.profilePicture || 'https://i.imgur.com/abc123.jpg',
            JSON.stringify(post.reactions || { likes: 0 }),
            new Date().toISOString(),
            0 
          ],
          (_, result) => {
            console.log('Post saved successfully:', post);
            resolve(result);
          },
          (_, error) => {
            console.error('Error saving post:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Database transaction error:', error);
  }
};

export const fetchLocalPosts = async () => {
  try {
    if (!db) await initDatabase();
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM posts ORDER BY timestamp DESC',
          [],
          (_, result) => resolve(result.rows.raw()),
          (_, error) => reject(error)
        );
      });
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

export const updatePostLocally = async (post) => {
  try {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `UPDATE posts 
           SET imageUrl=?, caption=?, likes=?, comments=?, 
               username=?, profilePicture=?, reactions=?
           WHERE id=?`,
          [
            post.imageUrl,
            post.caption,
            post.likes,
            JSON.stringify(post.comments),
            post.username,
            post.profilePicture,
            JSON.stringify(post.reactions),
            post.id
          ],
          (_, result) => {
            console.log('Post updated successfully:', post.id);
            resolve(result);
          },
          (_, error) => {
            console.error('Error updating post:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Update operation failed:', error);
  }
};

export const deletePostLocally = async (postId) => {
  try {
    if (!db) await initDatabase();

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM posts WHERE id=?',
          [postId],
          (_, result) => {
            console.log('Post deleted successfully:', postId);
            resolve(result);
          },
          (_, error) => {
            console.error('Error deleting post:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Delete operation failed:', error);
  }
};

export const syncPostsWithBackend = async (localPosts) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localPosts),
    });
    const data = await response.json();
    console.log('Synced posts with backend:', data);
    return data;
  } catch (error) {
    console.error('Error syncing posts:', error);
    throw error;
  }
};