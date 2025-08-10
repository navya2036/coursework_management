const { cleanEmptyFolders } = require('../utils/cleanupUtils');

router.delete('/deleteSubject/:id', async (req, res) => {
  try {
    // ...existing delete subject code...
    
    // Clean up empty folders after subject deletion
    await cleanEmptyFolders(path.join(__dirname, '../uploads'));
    
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    // ...existing error handling...
  }
});
