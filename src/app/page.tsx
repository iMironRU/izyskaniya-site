import { Button } from '@/components/Button/Button';

export default function Home() {
  return (
    <main className="flex flex-col gap-4 px-4 py-8">
      <h1 className="font-display text-4xl leading-tight font-bold">Инженерные изыскания под ваш участок</h1>
      <p className="text-md leading-normal text-text-secondary">Каркас проекта. Страницы появятся на этапе 6.</p>
      <Button>Рассчитать программу работ</Button>
    </main>
  );
}
