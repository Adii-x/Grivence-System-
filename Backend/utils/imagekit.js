module.exports={uploadToImageKit:async(file)=>file?`data:${file.mimetype};base64,${file.buffer.toString('base64')}`:null};
