import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');
    const { id, itemId } = params;
    const formData = await request.formData();

    const response = await fetch(
      `${apiUrl}/business/establishments/${id}/inventory/${itemId}/images`,
      {
        method: 'POST',
        headers: {
          ...(authHeader && { Authorization: authHeader }),
        },
        body: formData,
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload de imagens' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const authHeader = request.headers.get('Authorization');
    const { id, itemId } = params;
    const body = await request.json();

    const response = await fetch(
      `${apiUrl}/business/establishments/${id}/inventory/${itemId}/images`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar imagem' },
      { status: 500 }
    );
  }
}
