
import { createClient } from './client';

export class StorageService {
  private static supabase = createClient();

  static async uploadCVPDF(pdfBuffer: Buffer, fileName: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('cvs')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Lấy public URL
    const { data: { publicUrl } } = this.supabase.storage
      .from('cvs')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  static async deleteCVPDF(fileName: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('cvs')
      .remove([fileName]);

    if (error) {
      console.error('Delete PDF error:', error);
    }
  }

  static getCVPublicUrl(fileName: string): string {
    const { data: { publicUrl } } = this.supabase.storage
      .from('cvs')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }
}
