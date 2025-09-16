'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { UserRole } from '../../lib/auth';
import { api } from '../../lib/api';
import { MultiSelect } from '../ui/multi-select';
import { toast } from '../../hooks/use-toast';

export function UserForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  
  // Determine if this is a new user or editing existing user
  // If we're on /dashboard/users/new, there's no id param, so it's new
  // If we're on /dashboard/users/[id], then id is the user ID
  const id = params?.id || 'new';
  const isNewUser = id === 'new' || !params?.id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const token = localStorage.getItem('crm_token');
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [assignedCategoryIds, setAssignedCategoryIds] = useState<string[]>([]);
  const [assignedTagIds, setAssignedTagIds] = useState<string[]>([]);
  
  // Fetch categories and tags for assignment
  useEffect(() => {
    if (role === 'EDITOR' || role === 'AUTHOR' || role === 'PUBLISHER') {
      api.get('/categories', token || undefined).then(setCategories);
      api.get('/tags', token || undefined).then(setTags);
    }
  }, [role, token]);
  
  // Load user data if editing an existing user
  useEffect(() => {
    const loadUser = async () => {
      if (isNewUser) return;
      setLoading(true);
      setError(null);
      try {
        const user = await api.get(`/users/${id}`, token || undefined);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setAssignedCategoryIds(user.assignedCategoryIds || []);
        setAssignedTagIds(user.assignedTagIds || []);
      } catch (err) {
        setError('Failed to load user');
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id, token, isNewUser]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    if (isNewUser && password !== confirmPassword) {
      setError('Passwords do not match');
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }
    try {
      const extraFields = (role === 'EDITOR' || role === 'AUTHOR' || role === 'PUBLISHER')
        ? { assignedCategoryIds, assignedTagIds }
        : {};
      let response;
      if (isNewUser) {
        response = await api.post('/users', { name, email, password, role, ...extraFields }, token || undefined);
      } else {
        response = await api.put(`/users/${id}`, { name, email, role, ...(password ? { password } : {}), ...extraFields }, token || undefined);
      }
      toast({
        title: 'Success',
        description: response?.message || 'User saved successfully!',
        variant: 'default',
      });
      router.push('/dashboard/users');
    } catch (err: any) {
      let errorMsg = 'An error occurred';
      if (typeof err === 'string') {
        try {
          const parsed = JSON.parse(err);
          errorMsg = parsed.error || parsed.message || err;
        } catch {
          errorMsg = err;
        }
      } else if (err?.error) {
        errorMsg = err.error;
      } else if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          errorMsg = parsed.error || parsed.message || err.message;
        } catch {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      toast({
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  function buildCategoryTree(
    categories: any[],
    parentId: string | null = null
  ): (any & { children: any[] })[] {
    return categories
      .filter((cat: any) => cat.parentId === parentId)
      .map((cat: any) => ({
        ...cat,
        children: buildCategoryTree(categories, cat._id),
      }));
  }

  function handleCategoryToggle(id: string) {
    setAssignedCategoryIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }
  
  if (loading) {
    return <div className="flex justify-center p-8">Chargement de l'utilisateur...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isNewUser ? 'Créer un nouvel utilisateur' : 'Modifier l\'utilisateur'}</CardTitle>
          <CardDescription>
            {isNewUser 
              ? 'Remplissez les détails pour créer un nouveau compte utilisateur' 
              : 'Mettre à jour les détails du compte utilisateur'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                  <SelectItem value="AUTHOR">Auteur</SelectItem>
                  <SelectItem value="EDITOR">Éditeur</SelectItem>
                  <SelectItem value="PUBLISHER">Éditeur</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isNewUser && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez le mot de passe"
                    required={isNewUser}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez le mot de passe"
                    required={isNewUser}
                  />
                </div>
              </>
            )}
            
            {/* Category/Tag assignment for certain roles */}
            {(role === 'EDITOR' || role === 'AUTHOR' || role === 'PUBLISHER') && (
              <>
                <div className="space-y-2">
                  <Label>Catégories assignées</Label>
                  {buildCategoryTree(categories).map(cat => (
                    <div key={cat._id} className="mb-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={assignedCategoryIds.includes(cat._id)}
                          onChange={() => handleCategoryToggle(cat._id)}
                        />
                        <span>{cat.name}</span>
                      </label>
                      {cat.children.length > 0 && (
                        <div className="ml-4">
                          {cat.children.map((sub: any) => (
                            <label
                              key={sub._id}
                              className="flex items-center space-x-2 mt-1"
                            >
                              <input
                                type="checkbox"
                                checked={assignedCategoryIds.includes(sub._id)}
                                onChange={() => handleCategoryToggle(sub._id)}
                              />
                              <span>{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label>Tags assignés</Label>
                  <MultiSelect
                    options={tags.map((tag: any) => ({ value: tag.id || tag._id, label: tag.name }))}
                    value={assignedTagIds}
                    onChange={setAssignedTagIds}
                    placeholder="Sélectionner des tags"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/users')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder l\'utilisateur'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
