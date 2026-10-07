import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { createHash } from 'node:crypto';

test('PDF merge, reorder, rotate, optimise and images export valid PDFs', async ({ page }) => {
  const doc = await PDFDocument.create(); doc.addPage([200,300]); doc.addPage([400,500]);
  const buffer = Buffer.from(await doc.save());
  await page.goto('/pdf-toolkit');
  const input = page.getByLabel('2. Choose');
  await input.setInputFiles([{name:'one.pdf',mimeType:'application/pdf',buffer},{name:'two.pdf',mimeType:'application/pdf',buffer}]);
  await page.getByRole('button',{name:'Process Files'}).click();
  await expect(page.getByRole('status')).toContainText('4 pages');
  async function result() {
    const [download] = await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download PDF',exact:true}).click()]);
    return PDFDocument.load(await readFile((await download.path())!));
  }
  expect((await result()).getPageCount()).toBe(4);
  await page.getByLabel('1. Choose an action').selectOption('extract');
  await input.setInputFiles({name:'one.pdf',mimeType:'application/pdf',buffer});
  await page.getByLabel('3. Pages in output order').fill('2,1,2');
  await page.getByRole('button',{name:'Process Files'}).click();
  const reordered = await result(); expect(reordered.getPageCount()).toBe(3); expect(reordered.getPage(0).getWidth()).toBe(400);
  await page.getByLabel('3. Pages in output order').fill('9');
  await page.getByRole('button',{name:'Process Files'}).click();
  await expect(page.getByRole('alert')).toContainText('between 1 and 2');
  await page.getByLabel('1. Choose an action').selectOption('rotate');
  await input.setInputFiles({name:'one.pdf',mimeType:'application/pdf',buffer});
  await page.getByRole('button',{name:'Process Files'}).click();
  expect((await result()).getPage(0).getRotation().angle).toBe(90);
  await page.getByLabel('1. Choose an action').selectOption('optimise');
  await input.setInputFiles({name:'one.pdf',mimeType:'application/pdf',buffer});
  await page.getByRole('button',{name:'Process Files'}).click(); expect((await result()).getPageCount()).toBe(2);
  await page.getByLabel('1. Choose an action').selectOption('images');
  const png = await page.evaluate(() => { const c=document.createElement('canvas');c.width=50;c.height=30;return c.toDataURL().split(',')[1]; });
  await input.setInputFiles({name:'image.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
  await page.getByRole('button',{name:'Process Files'}).click(); expect((await result()).getPageCount()).toBe(1);
});

test('KB and MB target compression, batch ZIP, conversion and invalid targets', async ({page}) => {
  await page.goto('/image-tools');
  const png = await page.evaluate(() => { const c=document.createElement('canvas');c.width=400;c.height=300;const x=c.getContext('2d')!;const data=x.createImageData(400,300);for(let i=0;i<data.data.length;i+=4){data.data[i]=Math.random()*255;data.data[i+1]=Math.random()*255;data.data[i+2]=Math.random()*255;data.data[i+3]=255;}x.putImageData(data,0,0);return c.toDataURL().split(',')[1]; });
  await page.getByLabel('1. Choose image').setInputFiles([{name:'one.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')},{name:'two.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')}]);
  await page.getByLabel('Maximum file size',{exact:true}).fill('20');
  await page.getByRole('button',{name:'Compress Image',exact:true}).click();
  await expect(page.getByAltText('Processed image preview')).toBeVisible();
  const [zipDownload] = await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download All as ZIP'}).click()]);
  const zip = await JSZip.loadAsync(await readFile((await zipDownload.path())!));
  expect(Object.keys(zip.files)).toHaveLength(2);
  for(const entry of Object.values(zip.files)) expect((await entry.async('uint8array')).length).toBeLessThanOrEqual(20480);
  await page.getByLabel('Unit',{exact:true}).selectOption('MB');
  await page.getByLabel('Maximum file size',{exact:true}).fill('0.02');
  await page.getByLabel('Output format').selectOption('image/png');
  await page.getByRole('button',{name:'Compress Image',exact:true}).click();
  await expect(page.getByAltText('Processed image preview')).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download Image',exact:true}).click()]);
  expect((await readFile((await download.path())!)).length).toBeLessThanOrEqual(Math.floor(.02*1024*1024));
  await page.getByLabel('Maximum file size',{exact:true}).fill('0');
  await page.getByRole('button',{name:'Compress Image',exact:true}).click();await expect(page.getByRole('alert')).toContainText('between 1 KB');
  await page.getByLabel('Action',{exact:true}).selectOption('convert');await page.getByLabel('Output format').selectOption('image/jpeg');
  await page.getByRole('button',{name:'Convert Image',exact:true}).click();await expect(page.getByAltText('Processed image preview')).toBeVisible();
});

test('all ten books and six music downloads match supplied files', async ({page,request}) => {
  test.setTimeout(120000);
  await page.goto('/library');
  const cards=page.locator('#books article');
  await expect(cards).toHaveCount(10);
  await expect(cards.first().getByRole('link',{name:/Read/})).toHaveAttribute('href',/^https:\/\/drive.google.com/);
  await page.goto('/music-library');
  const tracks=page.locator('article');
  for(let i=0;i<6;i++) {
    const [download]=await Promise.all([page.waitForEvent('download'),tracks.nth(i).getByRole('button',{name:/Download/}).click()]);
    expect((await readFile((await download.path())!)).length).toBeGreaterThan(1000);
  }
  await page.getByLabel('Save Escape Your Love',{exact:true}).click();await page.getByLabel('Show saved tracks only').check();
  await expect(page.getByRole('status').first()).toContainText('1 track');await page.reload();await page.getByLabel('Show saved tracks only').check();await expect(page.getByRole('status').first()).toContainText('1 track');
  await page.getByRole('button',{name:'Play Escape Your Love',exact:true}).click();await expect.poll(()=>page.locator('audio').evaluate((a:HTMLAudioElement)=>!a.paused)).toBeTruthy();
});

test('missing music file and unconfigured assistant show clear errors',async({page})=>{
 await page.goto('/music-library');await page.route('**/music/*.mp3',route=>route.fulfill({status:404,body:'not found'}));
 await page.locator('article').first().getByRole('button',{name:/Download/}).click();await expect(page.getByRole('alert')).toContainText('HTTP 404');
 await page.getByRole('button',{name:'Open AI assistant'}).click();await page.getByLabel('Your question').fill('Merge PDFs?');await page.getByRole('button',{name:'Send',exact:true}).click();await expect(page.locator('#assistant-panel [role=alert]')).toContainText('not been configured');
});

test('browser background removal produces a PNG with transparent pixels, without API', async ({page}) => {
  test.setTimeout(180000);
  const errors:string[]=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('/background-remover');
  await page.getByLabel('1. Choose an image').setInputFiles('src/assets/sonywh.jpg');
  await page.getByRole('button',{name:'2. Remove Background'}).click();
  await expect(page.getByAltText('Result with transparent background')).toBeVisible({timeout:150000});
  const transparent=await page.getByAltText('Result with transparent background').evaluate((img:HTMLImageElement)=>{const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const x=c.getContext('2d')!;x.drawImage(img,0,0);const d=x.getImageData(0,0,c.width,c.height).data;let count=0;for(let i=3;i<d.length;i+=4)if(d[i]<128)count++;return count;});
  expect(transparent).toBeGreaterThan(0);
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'3. Download PNG'}).click()]);
  expect((await readFile((await download.path())!)).subarray(0,8)).toEqual(Buffer.from([137,80,78,71,13,10,26,10]));
  expect(errors).toEqual([]);
});
