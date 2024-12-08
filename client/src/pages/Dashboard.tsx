'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useSWR, { mutate } from 'swr'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2 } from 'lucide-react'
import { z } from 'zod'
import type { Scene, InsertScene } from '../types/schema'

const insertSceneSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url(),
  explanations: z.object({
    ja: z.string().min(1),
    en: z.string().min(1),
    zh: z.string().min(1),
  }),
})

export function Dashboard() {
  const { data: scenes, error } = useSWR<Scene[]>('/api/scenes')
  const { toast } = useToast()
  const [editingScene, setEditingScene] = useState<Scene | null>(null);

  const form = useForm<InsertScene>({
    resolver: zodResolver(insertSceneSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      explanations: {
        ja: '',
        en: '',
        zh: ''
      }
    }
  })

  const handleEdit = (scene: Scene) => {
    setEditingScene(scene);
    form.reset({
      name: scene.name,
      imageUrl: scene.imageUrl,
      explanations: scene.explanations
    });
  };

  const handleUpdate = async (data: InsertScene) => {
    if (!editingScene) return;
    
    try {
      const response = await fetch(`/api/scenes/${editingScene.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to update scene');
      
      toast({
        title: "Success",
        description: "Scene updated successfully"
      });
      
      setEditingScene(null);
      form.reset();
      mutate('/api/scenes');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update scene",
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (data: InsertScene) => {
    if (editingScene) {
      await handleUpdate(data);
    } else {
      try {
        const response = await fetch('/api/scenes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create scene');

        toast({
          title: "Success",
          description: "Scene created successfully",
        });

        form.reset();
        mutate('/api/scenes');
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create scene",
          variant: "destructive",
        });
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/scenes/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete scene')

      toast({
        title: "Success",
        description: "Scene deleted successfully",
      })

      mutate('/api/scenes')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete scene",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return <div>Error loading scenes</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Scene Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Scene</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanations.ja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Japanese Explanation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanations.en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Explanation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="explanations.zh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chinese Explanation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingScene ? 'Update Scene' : 'Add Scene'}
                </Button>
                {editingScene && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingScene(null);
                      form.reset({
                        name: '',
                        imageUrl: '',
                        explanations: {
                          ja: '',
                          en: '',
                          zh: ''
                        }
                      });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Current Scenes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenes?.map((scene) => (
                <TableRow key={scene.id}>
                  <TableCell>{scene.id}</TableCell>
                  <TableCell>{scene.name}</TableCell>
                  <TableCell>
                    <img 
                      src={scene.imageUrl} 
                      alt={scene.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(scene)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDelete(scene.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
